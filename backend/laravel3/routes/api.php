<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DatingController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\GroupController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/user', [UserController::class, 'getUser']);

    Route::post('/updateUser', [UserController::class, 'updateUser']);

    Route::get('/getAllUser', [UserController::class, 'getAllUser']);

    Route::get('/getUserById/{id}', [UserController::class, 'getUserById']);

    Route::get('/index', [UserController::class, 'index']);

    // friend

    Route::post('/friendRequest', [FriendController::class, 'manageFriendRequest']);

    Route::get('/getFriendList', [FriendController::class, 'getFriendList']);

    Route::get('/getFriendRequestsReceived', [FriendController::class, 'getFriendRequestsReceived']);

    Route::get('/checkFriendshipStatus/{friend_id}', [FriendController::class, 'checkFriendshipStatus']);

    // message

    Route::post('/sentMessage', [ChatController::class, 'sentMessage']);

    Route::get('/getMessage', [ChatController::class, 'getMessage']);

    Route::get('/getLastMessage', [ChatController::class, 'getLastMessage']);

    // post

    Route::post('/createPost', [PostController::class, 'createPost']);

    Route::get('/getAllPost', [PostController::class, 'getFriendPosts']);

    Route::get('/getPostById/{id}', [PostController::class, 'getPostById']);

    Route::get('/getPostByUserId/{id}', [PostController::class, 'getPostByUserId']);

    Route::post('/likePost', [PostController::class, 'likePost']);

    Route::post('/commentPost', [PostController::class, 'commentPost']);

    Route::post('/sharePost', [PostController::class, 'sharePost']);

    // search

    Route::get('/getPostByKeyword', [SearchController::class, 'getPostByKeyword']);

    // photo

    Route::get('/getPhotosByUserId/{id}', [UserController::class, 'getPhotosByUserId']);

    //notifications

    Route::get('/getNotification', [NotificationController::class, 'getNotification']);

    //Dating

    Route::post('/getDatingList', [DatingController::class, 'getDatingList']);

    Route::post('/sendDateInvitation', [DatingController::class, 'sendDateInvitation']);

    Route::get('/getReceivedDateInvitations', [DatingController::class, 'getReceivedDateInvitations']);

    //video

    Route::get('/getVideos', [VideoController::class, 'getVideos']);

    Route::post('/likeVideo', [VideoController::class, 'likeVideo']);

    Route::post('/commentVideo', [VideoController::class, 'commentVideo']);

    Route::get('/videos/{videoId}', [VideoController::class, 'getVideoById']);

    Route::get('/searchVideos', [VideoController::class, 'searchVideos']);

    //group

    Route::post('/groups/create', [GroupController::class, 'createGroup']);

    Route::post('/groups/invite', [GroupController::class, 'sendInvitationToJoinGroup']);

    Route::post('/groups/request', [GroupController::class, 'sendJoinRequestToGroup']);

    Route::get('/groups/{groupId}/requests', [GroupController::class, 'getGroupRequests']);

    Route::get('/groups/invitations', [GroupController::class, 'getUserGroupInvitations']);

    Route::put('groups/join-request', [GroupController::class, 'handleJoinRequestToGroup']);

    Route::put('groups/join-invitations', [GroupController::class, 'handleInvitationToJoinGroup']);

    Route::get('groups/{groupId}', [GroupController::class, 'getGroupById']);
});
