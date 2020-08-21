import _ from 'lodash';
import qs from 'query-string';
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
      debug(`Previewing document <${documentId}>...`);

      savePreviewToken(token);

      getPreviewPath(token, documentId).then((path) => {
        const parsed = qs.parseUrl(path, { parseFragmentIdentifier: true });

        history.push({
          pathname: parsed.url,
          hash: parsed.fragmentIdentifier,
          search: _.isEmpty(params) ? undefined : `?${qs.stringify(parsed.query)}`,
        });
      });
    }
  }, []);

  return <Fragment/>;
};

export default Preview;
