import { SignIn } from '@clerk/nextjs'

const signUpPage = () => {
  return (
    <div className='flex items-center h-screen w-screen justify-center'>
      <SignIn/>
    </div>
  )
}

export default signUpPage