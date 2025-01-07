import mongoose, { Schema } from 'mongoose';

const SubscriptionSchema = new Schema({
  subscriber:{
    type: Schema.Types.ObjectId, // one who is subscribing to the channel
    ref: 'User'
  },
  channel:{
    type:Schema.Types.ObjectId, // one to whon subscriber is subscribing
    ref: 'User'
  }
},{timestamps:true});


export const Subscription = mongoose.model('Subscription', SubscriptionSchema);
