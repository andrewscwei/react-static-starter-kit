import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { ComponentType, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { AppState } from '../store';
import { I18nState } from '../store/i18n';

interface StateProps {
  i18n: I18nState;
}

interface DispatchProps {}

interface OwnProps {}

interface Props extends StateProps, DispatchProps, OwnProps {}

export default function withPageTitle(titleId: string) {
  return (WrappedComponent: ComponentType<any>) => {
    class WithPageTitle extends PureComponent<Props> {
      constructor(props: Props) {
        super(props);
        document.title = this.props.i18n.ltxt(titleId);
      }

      render() {
        return <WrappedComponent {...this.props}/>;
      }
    }

    return connect((state: AppState): StateProps => ({
      i18n: state.i18n,
    }), (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({

    }, dispatch),
    )(hoistNonReactStatics(WithPageTitle, WrappedComponent));
  };
}
