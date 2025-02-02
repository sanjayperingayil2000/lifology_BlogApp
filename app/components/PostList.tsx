import Image from 'next/image';
import Link from 'next/link';

const PostList = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {posts.map((post) => {
        // Log the createdAt value to debug
        console.log('CreatedAt:', post.createdAt);

        // Parse the createdAt date
        const createdAtDate = new Date(post.createdAt);

        // Check if the date is valid
        const isValidDate = !isNaN(createdAtDate.getTime());

        // Format the date only if it's valid
        const formattedDate = isValidDate
          ? createdAtDate.toLocaleDateString()
          : "Invalid Date";

        return (
          <div key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-[320px]">
            <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold line-clamp-1 h-[24px]">{post.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-2 flex-grow">{post.description}</p>
              <p className="text-gray-500 text-xs mt-2">{formattedDate}</p>
              <button className="mt-auto bg-blue-500 text-white py-2 px-4 rounded-md">Read More</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;