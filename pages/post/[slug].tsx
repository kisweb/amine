import { GetStaticProps } from 'next'
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form"; 
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'

interface IFormInput {
  _id:string,
  name: string,
  email: string,
  comment: string
}
 interface Props{
   post:Post,
 };
const Post = ({post}: Props) => {
  const [submitted, setSubmitted] = useState(false)
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComments/', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then( () => {
      setSubmitted(true)
      console.log(data);
    }).catch((err) => {
      setSubmitted(true),
      console.log(err)
    });
    
  };

  return <main>
    <Header />
    
        <img
            src={urlFor(post.mainImage).url()}
            className='w-full object-cover h-60 rounded-lg group-hover:scale-105 overflow-hidden'
            alt={post.title}
        />
        <article className='max-w-3xl mx-auto p-4'>
            <h1 className='my-10 mb-5 text-black text-4xl'>{post.title}</h1>
            <h2 className='text-xl font-light text-gray-500 mb-3'>{post.description}</h2>
            <div className='flex items-center space-x-2'>
            <img className='w-12 h-12 rounded-full' src={urlFor(post.author.image).url()!} alt="auteur" />
            <p className='text-extralight font-sm'>Auteur : <span className='text-indigo-700'> {post.author.name}</span> - Publié le {new Date(post._createdAt).toLocaleString()!}</p>
            </div>
            <div className='mt-10'>
                <PortableText 
                  dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                  projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                  content={post.body}            
                />
            </div>
        </article>
        <hr className='max-w-lg mt-3 border border-yellow-500 mx-auto'/>
      {(submitted) ? (
      <div className='bg-green-600 rounded-lg max-w-lg mx-auto p-3 my-10'> <h1 className='text-white font-bold font-serif'>Votre commentaire a été transmis avec succès.</h1></div>
       ) : (
      <form onSubmit={handleSubmit(onSubmit)} className='max-w-lg mx-auto p-3 my-10'>
        <h3 className='text-light text-sm text-yellow-300 m--2 '>Des remarques sur cet article, faites le savoir.</h3>
        <h1 className='text-xl font-bold text-yellow-500 my-4 p-2'>Votre commentaire</h1>
        <hr  className='my-1'/>
        <input
          {...register("_id")}
          type="hidden" 
          name='_id' 
          value={post._id} 
        />
        <label className='block mb-5'>
          <span className='text-gray-700'>Nom</span>
          <input 
            {...register("name", { required: true })} 
            className='py-2 px-3 shadow border form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' 
            name='name' 
            type="text" 
            placeholder='Votre nom .....'/>
             {/* errors will return when field validation fails  */}
            {errors.name && <span className='text-yellow-700 p-2'>Votre nom est requis</span>}
        </label>
        <label className='block mb-5'>
          <span className='text-gray-700'>Email</span>
          <input 
            {...register("email", { required: true })} 
            className='py-2 px-3 shadow border form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' 
            name='email' 
            type="email" 
            placeholder='Votre adresse mail ....'/>
             {/* errors will return when field validation fails  */}
             {errors.email && <span className='text-red-700 p-2'>Votre email est requis</span>}
        </label>
        <label className='block mb-5' >
          <span className='text-gray-700'>Commentaire</span>
          <textarea 
            {...register("comment", { required: true })} 
            className='py-2 px-3 shadow border form-textaria mt-1 block w-full ring-yellow-500 outline-none focus:ring' 
            name="comment"
            rows={6}
            placeholder="Votre message" />
             {/* errors will return when field validation fails  */}
             {errors.comment && <span className='text-yellow-700 p-2'>Le commentaire ne peut être vide</span>}
        </label>
        <input 
          type="submit" 
          value="Envoyer"
          className='py-2 px-3 rounded-md border mt-1 block w-full cursor-pointer bg-yellow-500 hover:bg-yellow-300 shadow-outline hover:text-green-900 ring-rellow-500'
        />
      </form>)}
      {/* Les Commentaires  */}
      <div  className='flex flex-col p-10 m-10 md:max-w-2xl sm:max-w-lg max-w-md  shadow-yellow-600 shadow-md mx-auto' >
        <h1 className=' mb-3  text-yellow-600 text-3xl py-4 text-left px-3'>Commentaires</h1>
        <hr className='max-w-2xl border.yellow-600 mx-auto my-3' />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p className='mb-3 px-2'>
              <span className='text-yellow-500'>{comment.name} </span>
              <span className='text-gray-400'>{comment.comment}</span>
            </p>
            <p className='text-gray-400 text-right text-sm'>Posté le {new Date(post._createdAt).toLocaleString()!} </p>
            <hr className='border-1 border-gray-300 max-w-2xl mb-3' />
          </div>
        )  )}
      </div>
    
  </main>
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == 'post']
  {
    _id,
    slug{current,},
  }`
  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps:GetStaticProps = async ({params}) => {  

  const query = `*[_type == 'post' && slug.current == $slug][0]
  {
    _id,
    _createdAt,
    title,
    body,
    author->{name, image},
    mainImage,
    categories[]->{
      _id,
      title
    },
    "slug": slug.current,
    'comments': *[
      _type =='comment' &&
      post._ref == ^._id &&
      approuved == true],

  }`;
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if(!post){
    return {
      notFound:true,
    }
  }

  return {    
      props: {post},
      revalidate: 60, //after 60 seconds, it'll apdate  the old cached version    
    }

}
