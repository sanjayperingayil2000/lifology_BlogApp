import Image from "next/image";
import Link from "next/link";

const PostList = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mx-[5%] md:mx-[10%]">
      {posts.map((post) => {
        const formattedDate = new Date(post.createdAt).toLocaleDateString();

        return (
          <Link key={post.id} href={`/blog/${post.id}`} className="block">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-auto">
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={600}
                height={400}
                unoptimized
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold line-clamp-1 h-[24px]">{post.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2 flex-grow">{post.description}</p>
                <p className="text-gray-500 text-xs mt-2">{formattedDate}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PostList;
