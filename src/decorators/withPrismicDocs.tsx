import { Location } from 'history';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { Document } from 'prismic-javascript/d.ts/documents';
import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { getLocaleFromPath } from '../routes';
import { AppState } from '../store';
import { fetchDocsByType } from '../store/prismic';
import { loadPreviewToken, localeResolver } from '../utils/prismic';

const debug = require('debug')('app:prismic-docs');

interface StateProps {
  docs?: { [locale: string]: ReadonlyArray<Document> };
}

interface DispatchProps {
  fetchDocsByType: typeof fetchDocsByType;
}

interface OwnProps {
  location: Location;
}

interface Props extends StateProps, DispatchProps, OwnProps {}

export default function withPrismicDocs(type: string) {
  return (WrappedComponent: typeof Component) => {
    class WithPrismicDocs extends PureComponent<Props> {
      constructor(props: Props) {
        super(props);
        this.fetchDoc();
      }

      async fetchDoc() {
        const currentPath = this.props.location.pathname.replace(/\/*$/, '') + '/';
        const locale = getLocaleFromPath(currentPath);
        const previewToken = loadPreviewToken();

        if (previewToken) {
          debug('Getting preview token from cookies...', 'OK', previewToken);
        }
        else {
          debug('Getting preview token from cookies...', 'SKIPPED');
        }

        await this.props.fetchDocsByType(type, {
          lang: localeResolver(locale),
          ref: previewToken,
        });

        if (previewToken) {
          debug(`A preview reference exists for the current path "${currentPath}", fetching the preview doc...`, 'OK');
        }
        else {
          debug(`Fetching doc for path "${currentPath}"...`, 'OK');
        }
      }

      render() {
        return (
          <WrappedComponent {...this.props}/>
        );
      }
    }

    return connect((state: AppState): StateProps => ({
        docs: state.prismic.docs[type],
      }), (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
        fetchDocsByType,
      }, dispatch),
    )(hoistNonReactStatics(WithPrismicDocs, WrappedComponent));
  };
}
