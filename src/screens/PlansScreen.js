import { queryAllByAltText } from "@testing-library/dom";
import React, { useState, useEffect } from "react";
import "./PlansScreen.css";
import db from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  // პროდუქტების აღწერა და ფასები
  useEffect(() => {
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            // ფასები
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
            };
          });
        });
        setProducts(products);
      });
  }, []);

  const loadChekout = async (priceId) => {
    // user.uid რედაქსიდან მოდის ეს,  docRef იქნება ომ იუზერის მონაცემები ვინც დალოგინებული
    // .collection("checkout_sessions") არის ახალი ბაზა რომელიც შეიქმნება როცა იუზერი suvscribe-ს გააკეთებს
    // add({}) ამით გადავცემთ იმ მონაცემებს რაც გვინა რომ ამ ბაზაში ჩაჯდეს
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    // ჩექაუთის გვერდზე გადასვლა ან ერორი

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        alert(`An error occured: ${error.message}`);
      }
      if (sessionId) {
        // ჩექაუთზე გადასვლა
        const stripe = await loadStripe(
          "pk_test_51IgDpME12oV19bqg8pQC8dg22uOV9spMMgr5l0mEZdBq49qemfMueoZl6nqubJsloJV5yivAfM5U7mVIXpDAz1eo00vEYOyAnE"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div>
      {Object.entries(products).map(([productId, productData]) => {
        return (
          <div className="plansScreen_plan">
            <div className="plansScreen_info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button onClick={() => loadChekout(productData?.prices?.priceId)}>
              Subscribe
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
