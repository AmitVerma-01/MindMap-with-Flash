import { SignUp } from '@clerk/nextjs'

const signUpPage = () => {
  return (
    <div className='flex items-center h-screen w-screen justify-center'>
      <SignUp/>
    </div>
  )
}

export default signUpPage