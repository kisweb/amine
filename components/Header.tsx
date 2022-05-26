import Link from 'next/link'

function Header() {
  return (
    <header className='flex items-center justify-between max-w-5xl mx-auto p-5'>
        <div className="flex items-center space-x-5">
          <Link href="/">
            <img className="w-12 object-contain cursor-pointer" src="/kisarr-bit.png" alt="Logo" />
          </Link>
          <div className="hidden md:inline-flex items-center space-x-5">
            <h3>About</h3>
            <h3>Contact</h3>
            <h3 className='bg-green-500 text-white px-3 py-1 rounded-full'>Follow</h3>
          </div>
        </div>
        <div className='flex items-center space-x-5 text-green-500'>
          <h3>Sign in</h3>
          <h3 className='border rounded-full px-4 py-1'>Get Started</h3>
        </div>
    </header>
  )
}

export default Header
