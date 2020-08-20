import React, { Fragment, FunctionComponent, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import debug from '../utils/debug';
import { getPreviewPath, savePreviewToken } from '../utils/prismic';

interface Props extends RouteComponentProps {}

const Preview: FunctionComponent<Props> = ({ location, history }: Props) => {
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const documentId = params.get('documentId');

    if (token && documentId) {
      document.title = 'Previewing...';

      debug(`Previewing document <${documentId}>...`);

      savePreviewToken(token);

      getPreviewPath(token, documentId).then((path) => {
        history.push({
          pathname: path,
        });
      });
    }
  }, []);

  return <Fragment/>;
};

export default Preview;
