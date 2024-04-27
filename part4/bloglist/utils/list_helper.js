const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  //console.log("receiving blogs", blogs);
  const likesReducer = (sum, blog) => {
    //console.log("sum", sum, "likes", blog.likes);
    return sum + blog.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(likesReducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    const compareLikes = (a, b) => {
      return b.likes - a.likes;
    };

    const sortedBlogs = blogs.sort(compareLikes);
    const mostLikedBlog = sortedBlogs[0];
    console.log("mostLikedBlog ", mostLikedBlog);
    return {
      title: mostLikedBlog.title,
      author: mostLikedBlog.author,
      likes: mostLikedBlog.likes,
    };
  }
};

// returns author with most blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    const authorBlogMap = blogs.reduce((map, currentBlog) => {
      //console.log("reading blog from", currentBlog.author);
      if (currentBlog.author in map) {
        map[currentBlog.author]++;
      } else {
        map[currentBlog.author] = 1;
      }
      //console.log("map till now", map);
      return map;
    }, {});

    const authorWithMostBlogs = Object.keys(authorBlogMap).reduce(
      (previous, actual) => {
        return authorBlogMap[previous] > authorBlogMap[actual]
          ? previous
          : actual;
      },
      "",
    );

    //console.log("authorWithMostBlogs", authorWithMostBlogs);

    return {
      author: authorWithMostBlogs,
      blogs: authorBlogMap[authorWithMostBlogs],
    };
  }
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    const authorLikesMap = blogs.reduce((map, currentBlog) => {
      //console.log("reading blog from", currentBlog.author);
      if (currentBlog.author in map) {
        map[currentBlog.author] += currentBlog.likes;
      } else {
        map[currentBlog.author] = currentBlog.likes;
      }
      //console.log("map till now", map);
      return map;
    }, {});

    const authorWithMostLikes = Object.keys(authorLikesMap).reduce(
      (previous, actual) => {
        return authorLikesMap[previous] > authorLikesMap[actual]
          ? previous
          : actual;
      },
      "",
    );

    return {
      author: authorWithMostLikes,
      likes: authorLikesMap[authorWithMostLikes],
    };
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};