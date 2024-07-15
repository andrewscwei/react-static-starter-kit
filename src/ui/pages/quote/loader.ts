import { defer, type LoaderFunctionArgs } from 'react-router'
import { GetQuote } from '../../../useCases/GetQuote.js'

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  return defer({
    quote: new GetQuote().run(),
  })
}
