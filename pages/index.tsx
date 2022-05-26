import  {sanityClient, urlFor}  from '../sanity'
import Head from 'next/head'
import Header from '../components/Header'
import { Post } from '../typings'
import Link from 'next/link';

interface Props {
  posts: Post[];
}

export default function Home({posts}: Props) {
  console.log(posts)
  return (
    <div className="">
      <Head>
        <title>Sanity Kisarr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className='flex items-center justify-between max-w-5xl mx-auto p-5'>
        <div className='py-10 space-y-5'>
          <h1 className='text-7xl text-center font-serif bg-amber-100 py-2 rounded-full max-w-xl mx-auto'>Al Amine </h1>
          <h2 className='max-w-xl mx-auto'>Le seul endroit de Bignona où vous pouvez trouver votre bonheur</h2>
          <p className='text-gray-600 max-w-xl mx-auto'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, impedit iste iusto in eius vero voluptatibus neque accusamus quaerat ea saepe, possimus a quam. Quis doloribus voluptatum vero dicta consequatur?</p>
        </div>
        
        <img className="hidden md:inline-flex h-36 rounded-md lg:h-full" src="/kisarr-bit.png" alt="Logo" />
        
      </div>
      {/* Posts */}
      <div className='grid grid-cols-1 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-5 px-4 py-1'>
        {posts.map(post => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='group cursor-pointer border-2 p-2 shadow-md'>
            <h1 className='text-3xl py-3 text-center'>{post.title}</h1>
              <img
                src={urlFor(post.mainImage).url()}
                className='w-full object-cover h-60 rounded-lg group-hover:scale-105 overflow-hidden'
                alt={post.title}
              />
              <div>
                <div>
                
                <p className='text-center text-lg first-letter:text-green-900'>{post.description} </p> 
                </div>
                <div  className="flex items-center justify-between py-4">
                <p> Publié le {post._createdAt} by {post.author.name}</p>

              <img className='w-12 h-12 rounded-full' src={urlFor(post.author.image).url()!} alt="auteur" />
                </div>

              </div>
            </div>
          </Link>
        ))};
      </div>
      
    </div>
  )
}


export const getServerSideProps = async () => {
  const query = `*[_type == 'post']
  {
    _id,
    title,
    description,
    slug,
    publishedAt,
    mainImage,
    "categories": categories[]->title,
    author -> {
    name, image
  }
  }`;
  const posts = await sanityClient.fetch(query);
  return {
    props:{
      posts:posts,
    }
  }
  
}
