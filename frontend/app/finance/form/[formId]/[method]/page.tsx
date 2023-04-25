import { NextPage } from 'next'
import RecordForm from '@/components/RecordForm'
import { defaultRecord } from '@/types/finance/record'

type Props = {
  params: {
    formId: 'category' | 'record' | 'tag'
    method: 'create' | 'update' | 'delete'
  }
}

const Page: NextPage<Props> = ({ params }) => {
  console.log(params.formId)

  return (
    <div>
      {params.formId === 'record' && <RecordForm record={defaultRecord} method={params.method} />}
    </div>
  )
}

export default Page
