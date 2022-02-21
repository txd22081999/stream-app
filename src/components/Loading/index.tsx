import React from 'react'
import { PacmanLoader } from 'react-spinners'

interface ILoadingProps {
  loading: boolean
}

const Loading = (props: ILoadingProps) => {
  const { loading } = props
  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
      <PacmanLoader color='#9047FF' loading={loading} size={20} />
    </div>
  )
}

export default Loading
