import { Location } from 'history';
import hoistNonReactStatics from 'hoist-non-react-statics';
import _ from 'lodash';
import { Document } from 'prismic-javascript/d.ts/documents';
import React, { ComponentType, PureComponent } from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { getLocaleFromPath } from '../routes';
import { AppState } from '../store';
import { fetchDocByTypeUID, fetchDocsByType } from '../store/prismic';
import { loadPreviewToken, localeResolver } from '../utils/prismic';

const debug = require('debug')('app:prismic-doc');

interface StateProps {
  docs?: { [locale: string]: ReadonlyArray<Document> };
}

interface DispatchProps {
  fetchDocByTypeUID: typeof fetchDocByTypeUID;
  fetchDocsByType: typeof fetchDocsByType;
}

interface OwnProps {
  match: match<any>;
  location: Location;
}

interface Props extends StateProps, DispatchProps, OwnProps {}

export default function withPrismicDoc(type: string, uid?: string) {
  return (WrappedComponent: ComponentType<any>) => {
    class WithPrismicDoc extends PureComponent<Props> {
      constructor(props: Props) {
        super(props);
        this.fetchDoc();
      }

      async fetchDoc() {
        const currentPath = this.props.location.pathname.replace(/\/*$/, '') + '/';
        const locale = getLocaleFromPath(currentPath);
        const targetUid = uid || this.props.match.params.uid;
        const previewToken = loadPreviewToken();

        if (previewToken) {
          debug('Getting preview token from cookies...', 'OK', previewToken);
        }
        else {
          debug('Getting preview token from cookies...', 'SKIPPED');
        }

        if (targetUid) {
          await this.props.fetchDocByTypeUID(type, targetUid, {
            lang: localeResolver(locale),
            ref: previewToken,
          });
        }
        else {
          await this.props.fetchDocsByType(type, {
            lang: localeResolver(locale),
            ref: previewToken,
          });
        }

        if (previewToken) {
          debug(`A preview reference exists for the current path "${currentPath}", fetching the preview doc...`, 'OK');
        }
        else {
          debug(`Fetching doc for path "${currentPath}" and UID "${targetUid}"...`, 'OK');
        }
      }

      render() {
        const locale = getLocaleFromPath(this.props.location.pathname);
        const targetUid = uid || this.props.match.params.uid;
        const doc = targetUid ? _.find(this.props.docs && this.props.docs[locale], doc => doc.uid === targetUid) : _.get(this.props.docs && this.props.docs[locale], '[0]');

        return (
          <WrappedComponent doc={doc} {...this.props}/>
        );
      }
    }

    return connect((state: AppState): StateProps => ({
      docs: state.prismic.docs[type],
    }), (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
      fetchDocByTypeUID,
      fetchDocsByType,
    }, dispatch))(hoistNonReactStatics(WithPrismicDoc, WrappedComponent));
  };
}
