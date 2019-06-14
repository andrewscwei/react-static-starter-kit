import { Location } from 'history';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { Document } from 'prismic-javascript/d.ts/documents';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { getLocaleFromPath } from '../routes';
import { AppState } from '../store';
import { fetchDocsByType } from '../store/prismic';

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

interface State {

}

export default function withPrismicDoc(type: string) {
  return (WrappedComponent: typeof PureComponent) => {
    class WithPrismicDoc extends PureComponent<Props, State> {
      constructor(props: Props) {
        super(props);
        this.props.fetchDocsByType(type, getLocaleFromPath(props.location.pathname));
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
    )(hoistNonReactStatics(WithPrismicDoc, WrappedComponent));
  };
}
