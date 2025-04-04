import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = 'pk_test_51R3JsIH13kjsZOdW6aLCEp54ZV5FokymjDof91cn6uC8e5KF8vVy1bw1oSNYFy6oa7zZtON014LlaZcTcYrruwWC000NxlWsX8';

export const getStripe = async () => {
  const stripePromise = loadStripe(stripePublicKey);
  return stripePromise;
}; 