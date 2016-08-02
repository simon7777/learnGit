class FriendshipsController < ApplicationController

  def create
    @friendship = Friendship.new(:friend1 => current_user.id, :friend2 => params[:friend2],
                                :sent => true, :accepted => false)
    friend = Friendship.new(:friend2 => current_user.id, :friend1 => params[:friend2],
                            :sent => false, :accepted => false)
    if @friendship.save && friend.save && create_notification(params[:friend2], 10 , 'sent request for friendship. If you want to accept, go to his/her profile and click: Accept friendship')
      flash[:info] = 'Request sent'
      redirect_to :back
    else
      flash[:danger] = 'Request wasn\'t sent properly'
      redirect_to :back
    end
  end

  def accept
    friend = Friendship.find_by_friend1_and_friend2(current_user.id, params[:friend2])
    friend.update_attributes(:sent => true, :accepted => true)
    friend = Friendship.find_by_friend1_and_friend2(params[:friend2], current_user.id)
    friend.update_attribute(:accepted, true)
    create_notification(params[:friend2], 11, 'accepted friendship. Now, you\'re friends')
    flash[:info] = 'Friendship\'s accepted'
    redirect_to :back
  end


  def destroy
    friend = Friendship.where(:friend1 => current_user.id, :friend2 => params[:id]).first
    friend2 = Friendship.where(:friend1 => params[:id], :friend2 => current_user.id).first
    if friend.destroy && friend2.destroy
      flash[:info] = 'Friendship deleted'
    else
      flash[:danger] = 'Friendship couldn\'t be deleted'
    end
    redirect_to :back
  end
end

