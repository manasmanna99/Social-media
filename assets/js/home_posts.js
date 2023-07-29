{
  // method to submit the form data for new post using AJAX

  let newPostForm = $("#new-post-form");

  newPostForm.submit(function (e) {
    e.preventDefault();

    $.ajax({
      type: "post",
      url: "/posts/create",
      data: newPostForm.serialize(),
      success: function (data) {
        let newPost = newPostDom(data.data.post);
        $("#posts-list-container>ul").prepend(newPost);

        // call the create comment class
        new PostComments(data.data.post._id);

        deletePost();

        // CHANGE :: enable the functionality of the toggle like button on the new post
        new ToggleLike($(" .toggle-like-button", newPost));

        new Noty({
          theme: "relax",
          text: "Post published!",
          type: "success",
          layout: "topRight",
          timeout: 1500,
        }).show();
      },
      error: function (error) {
        console.log(error.responseText);
      },
    });
  });

  // method to create a post in DOM
  let newPostDom = function (post) {
    // CHANGE :: show the count of zero likes on this post
    document.getElementById("post-box").value = "";
    return $(`<li id="post-${post._id}">
                    <p>
                        
                        <small>
                            <a class="delete-post-button"  href="/posts/destroy/${post._id}">X</a>
                        </small>
                       
                        ${post.content}
                        <br>
                        <small>
                        <i>-${post.user.name}</i>
                        </small>
                        <br>
                        <small>
                            
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                    0 Likes
                                </a>
                            
                        </small>

                    </p>
                    <div class="post-comments">
                        
                            <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                                <input type="text" id="comment-box" name="content" placeholder="Type Here to add comment..." required>
                                <input type="hidden" name="post" value="${post._id}" >
                                <input type="submit" value="Add Comment">
                            </form>
               
                
                        <div class="post-comments-list">
                            <ul id="post-comments-${post._id}">
                                
                            </ul>
                        </div>
                    </div>
                    
                </li>`);
  };

  // method to delete a post from DOM
  let deletePost = function () {
    $("#posts-list-container>ul>li").each(function () {
      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);

      deleteButton.click(function (e) {
        e.preventDefault();
        $.ajax({
          type: "get",
          url: deleteButton.prop("href"),
          success: function (data) {
            $(`#post-${data.data.post_id}`).remove();
            new Noty({
              theme: "relax",
              text: "Post Deleted",
              type: "success",
              layout: "topRight",
              timeout: 1500,
            }).show();
          },
          error: function (error) {
            console.log(error.responseText);
          },
        });
      });
    });
  };

  //on page load converting all posts to ajax
    $('#posts-list-container>ul>li').each(function(){
        let self = $(this);
        deletePost()

        // get the post's id by splitting the id attribute
        let postId = self.prop('id').split("-")[1]
        new PostComments(postId);
    });
}