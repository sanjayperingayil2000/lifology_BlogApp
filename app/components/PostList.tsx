import Image from "next/image";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  imageUrl: string;
  author: {
    name: string;
  };
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mx-[1%] md:mx-[5%]">
      {posts.map((post) => (
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
              <p className="text-gray-600 text-sm">By {post.author.name}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostList;
