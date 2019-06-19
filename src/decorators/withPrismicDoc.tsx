import { Location } from 'history';
import hoistNonReactStatics from 'hoist-non-react-statics';
import _ from 'lodash';
import { Document } from 'prismic-javascript/d.ts/documents';
import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { getLocaleFromPath } from '../routes';
import { AppState } from '../store';
import { fetchDocByTypeUID } from '../store/prismic';
import { loadPreviewToken, localeResolver } from '../utils/prismic';

const debug = require('debug')('app:prismic-doc');

interface StateProps {
  docs?: { [locale: string]: ReadonlyArray<Document> };
}

interface DispatchProps {
  fetchDocByTypeUID: typeof fetchDocByTypeUID;
}

interface OwnProps {
  match: match<any>;
  location: Location;
}

interface Props extends StateProps, DispatchProps, OwnProps {}

export default function withPrismicDoc(type: string) {
  return (WrappedComponent: typeof Component) => {
    class WithPrismicDoc extends PureComponent<Props> {
      constructor(props: Props) {
        super(props);
        this.fetchDoc();
      }

      async fetchDoc() {
        const currentPath = this.props.location.pathname.replace(/\/*$/, '') + '/';
        const locale = getLocaleFromPath(currentPath);
        const uid = this.props.match.params.uid;
        const previewToken = loadPreviewToken();

        if (previewToken) {
          debug('Getting preview token from cookies...', 'OK', previewToken);
        }
        else {
          debug('Getting preview token from cookies...', 'SKIPPED');
        }

        await this.props.fetchDocByTypeUID(type, uid, {
          lang: localeResolver(locale),
          ref: previewToken,
        });

        if (previewToken) {
          debug(`A preview reference exists for the current path "${currentPath}", fetching the preview doc...`, 'OK');
        }
        else {
          debug(`Fetching doc for path "${currentPath}" and UID "${uid}"...`, 'OK');
        }
      }

      render() {
        const locale = getLocaleFromPath(this.props.location.pathname);
        const uid = this.props.match.params.uid;

        return (
          <WrappedComponent doc={_.find(this.props.docs && this.props.docs[locale], doc => doc.uid === uid)} {...this.props}/>
        );
      }
    }

    return connect((state: AppState): StateProps => ({
        docs: state.prismic.docs[type],
      }), (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
        fetchDocByTypeUID,
      }, dispatch),
    )(hoistNonReactStatics(WithPrismicDoc, WrappedComponent));
  };
}
