import { NextPage } from 'next'
import RecordForm from '@/components/RecordForm'
import CategoryTagForm from '@/components/CategoryTagForm'
import { defaultRecord } from '@/types/finance/record'

type Props = {
  params: {
    formId: 'category' | 'record' | 'tag'
    method: 'create' | 'update' | 'delete'
  }
}

const defaultData = {
  id: 0,
  name: '',
  created_at: '',
  remarks: '',
}

const Page: NextPage<Props> = ({ params }) => {
  console.log(params.formId)

  return (
    <div>
      {
        params.formId === 'record' ? <RecordForm record={defaultRecord} method={params.method} />
          : params.formId === 'category' ? <CategoryTagForm formType='category' method={params.method} data={defaultData} />
            : params.formId === 'tag' ? <CategoryTagForm formType='tag' method={params.method} data={defaultData} />
              : <div>404</div>
      }
    </div>
  )
}

export default Page
