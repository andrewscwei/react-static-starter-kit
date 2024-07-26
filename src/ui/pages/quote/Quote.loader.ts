import { type LoaderFunctionArgs } from 'react-router'
import { getRandomQutoe } from '../../../services/index.js'

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  return getRandomQutoe()
}
