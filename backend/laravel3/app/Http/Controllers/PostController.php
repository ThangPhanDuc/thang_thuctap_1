<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use App\Models\Photo;
use App\Models\Like;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Support\Facades\File;
use App\Events\CommentPost;
use App\Events\NotificationEvent;
use App\Models\Friend;
use Illuminate\Pagination\Paginator;
use App\Models\Notification;
use App\Models\NotificationLike;
use App\Models\NotificationComment;
use App\Models\Video;
use App\Models\SharedPost;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{

    // public function createPost(Request $request)
    // {
    //     $user = Auth::user();
    //     $user_id = $user->id;
    //     $content = $request->content;

    //     $post = new Post();
    //     $post->user_id = $user_id;
    //     $post->content = $content;
    //     $post->save();

    //     //save media
    //     $mediaFiles = $request->file('media');

    //     foreach ($mediaFiles as $media) {
    //         $mediaName = time() . '_' . $media->getClientOriginalName();
    //         $mediaExtension = $media->getClientOriginalExtension();

    //         if (in_array($mediaExtension, ['jpg', 'jpeg', 'png', 'gif'])) {
    //             $media->move(public_path('Post_Images'), $mediaName);

    //             $photo = new Photo();
    //             $photo->post_id = $post->id;
    //             $photo->path = 'Post_Images/' . $mediaName;
    //             $photo->save();
    //         } elseif (in_array($mediaExtension, ['mp4', 'mov'])) {
    //             $media->move(public_path('Post_Videos'), $mediaName);

    //             $videoFile = new Video();
    //             $videoFile->post_id = $post->id;
    //             $videoFile->path = 'Post_Videos/' . $mediaName;
    //             $videoFile->save();
    //         }
    //     }

    //     return response()->json(['status' => 'create post successfully']);
    // }

    // public function createPost(Request $request)
    // {
    //     $image = $request->file('image');

    //     // Kiểm tra xem có tệp hình ảnh được gửi lên không
    //     if ($image) {
    //         // Đặt tên thư mục trên Cloudinary
    //         $folderName = 'post_images';

    //         // Tải lên hình ảnh và lưu vào thư mục trên Cloudinary
    //         $uploadedImage = Cloudinary::upload($image->getRealPath(), [
    //             'folder' => $folderName,
    //         ]);

    //         // Lấy URL xem trước của hình ảnh
    //         $imageUrl = $uploadedImage->getSecurePath();

    //         // Trả về URL xem trước của hình ảnh
    //         return response()->json(['image_url' => $imageUrl]);
    //     }

    //     // Trả về thông báo lỗi nếu không có tệp hình ảnh được gửi lên
    //     return response()->json(['error' => 'No image file found.']);
    // }

    public function createPost(Request $request)
    {
        $user = Auth::user();
        $user_id = $user->id;
        $content = $request->content;

        $post = new Post();
        $post->user_id = $user_id;
        $post->content = $content;
        $post->save();

        //save media
        $mediaFiles = $request->file('media');

        foreach ($mediaFiles as $media) {
            $mediaName = time() . '_' . $media->getClientOriginalName();
            $mediaExtension = $media->getClientOriginalExtension();

            if (in_array($mediaExtension, ['jpg', 'jpeg', 'png', 'gif'])) {
                $uploadedImage = Cloudinary::upload($media->getRealPath(), [
                    'folder' => "Post_Images",
                ]);
                $imageUrl = $uploadedImage->getSecurePath();

                $photo = new Photo();
                $photo->post_id = $post->id;
                $photo->path =  $imageUrl;
                $photo->save();
            } elseif (in_array($mediaExtension, ['mp4', 'mov'])) {
                $uploadedVideo = Cloudinary::upload($media->getRealPath(), [
                    'folder' => "Post_Videos",
                    "resource_type" => "video",
                ]);
                $videoUrl = $uploadedVideo->getSecurePath();

                $videoFile = new Video();
                $videoFile->post_id = $post->id;
                $videoFile->path = $videoUrl;
                $videoFile->save();
            }
        }

        return response()->json(['status' => 'create post successfully']);
    }



    public function getFriendPosts(Request $request)
    {
        $user = Auth::user();
        $friendsPosts = $user->friendPosts()->paginate(10);

        foreach ($friendsPosts as $post) {
            $post->liked_by_user = $post->likes()->where('user_id', $user->id)->exists();
        }

        return $friendsPosts;
    }

    // public function getAllPost(Request $request)
    // {
    //     $user = Auth::user();
    //     $friendsPosts = $user->friendPosts()->paginate(10);

    //     $userPosts = $user->posts()->paginate(10);

    //     $groupPosts = $user->groupPosts()->paginate(10);



    //     $combinedPosts = [
    //         'friends' => $friendsPosts,
    //         'user' => $userPosts,
    //         'group' => $groupPosts,
    //     ];




    //     // foreach ($friendsPosts as $post) {
    //     //     $post->liked_by_user = $post->likes()->where('user_id', $user->id)->exists();
    //     // }

    //     return $combinedPosts;
    // }

    public function getPostById(Request $request)
    {
        $user = Auth::user();
        $post_id = $request->id;
        $post = Post::where('id', $post_id)
            ->with('user', 'photos', 'comments.user', 'videos')
            ->withCount('likes')
            ->first();

        if (!$post) {
            return response()->json(['message' => 'The post does not exist'], 404);
        }

        $post->liked_by_user = $post->likes()->where('user_id', $user->id)->exists();

        return response()->json($post);
    }
    public function getPostByUserId(Request $request)
    {
        $userLogin = Auth::user();
        $user_id = $request->id;
        $posts = Post::where("user_id", $user_id)
            ->with('user', 'comments.user', 'photos', 'videos')
            ->withCount('likes')
            ->orderBy('posts.created_at', 'desc')
            ->paginate(10);

        foreach ($posts as $post) {
            $post->liked_by_user = $post->likes()->where('user_id', $userLogin->id)->exists();
        }

        return response()->json($posts);
    }

    public function likePost(Request $request)
    {
        $user  = Auth::user();
        $post_id = $request->post_id;

        $existingLike = Like::where('user_id', $user->id)
            ->where('post_id', $post_id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            return response()->json(['status' => 'You have unliked this post']);
        } else {
            $like = new Like();
            $like->user_id = $user->id;
            $like->post_id = $post_id;
            $like->save();

            $post = Post::where("id", $post_id)->first();

            if ($user->id != $post->user_id) {
                $data =   [
                    'userLike' => $user,
                    'post_id' => $post_id,
                ];
                event(new NotificationEvent(
                    $post->user_id,
                    "like_notification",
                    $data,
                ));


                $notification = new Notification();
                $notification->sender_id = $user->id;
                $notification->recipient_id =  $post->user_id;
                $notification->type = "like_notification";
                $notification->save();

                $notificationLike = new NotificationLike();
                $notificationLike->notification_id = $notification->id;
                $notificationLike->like_id = $like->id;
                $notificationLike->save();
            }

            return response()->json(['status' => 'like post successfully']);
        }
    }

    public function commentPost(Request $request)
    {
        $user  = Auth::user();
        $post_id = $request->post_id;
        $content = $request->content;

        $comment = new Comment();
        $comment->user_id = $user->id;
        $comment->post_id = $post_id;
        $comment->content = $content;
        $comment->save();

        $post = Post::where("id", $post_id)->first();

        if ($post->user_id != $user->id) {

            $data =   [
                'userComment' => $user,
                'post_id' => $post_id,
                'content' => $content,
            ];

            event(new NotificationEvent(
                $post->user_id,
                "comment_notification",
                $data,
            ));

            $notification = new Notification();
            $notification->sender_id = $user->id;
            $notification->recipient_id =  $post->user_id;
            $notification->type = "comment_notification";
            $notification->save();

            $notificationComment = new NotificationComment();
            $notificationComment->notification_id = $notification->id;
            $notificationComment->comment_id = $comment->id;
            $notificationComment->save();
        }

        return response()->json(['status' => 'comment post successfully']);
    }

    public function sharePost(Request $request)
    {
        $user = Auth::user();
        $post_id = $request->post_id;

        $sharedPost = new SharedPost();
        $sharedPost->user_id = $user->id;
        $sharedPost->post_id = $post_id;
        $sharedPost->save();

        return response()->json(['message' => 'Post has been successfully shared'], 200);
    }
}
