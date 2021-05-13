import React, { useState, useEffect } from "react";
import "./PlansScreen.css";
import db from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  // ვამოწმებთ დალოგინებულ იუზერს უკვე აქვს უ არა რამე პაკეტი ნაყიდი, თუ ნაყიდი აქვს ვაბრუნებთ პაკეტის სახელს ყიდვის დროს და პაკეტის ვადას
  useEffect(() => {
    db.collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (subscription) => {
          setSubscription({
            name: subscription.data().items[0].price.product.name.toLowerCase(),
            current_period_end: subscription.data().current_period_end.seconds,
            current_period_start:
              subscription.data().current_period_start.seconds,
          });
        });
      });
  }, [user.uid]);

  // პროდუქტების აღწერა და ფასები
  useEffect(() => {
    console.log("fg");
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          console.log("sdf");
          //  productDoc.data() არ მოაქვს ფასები, ფასები ცალკე კოლექცია და ამიტო ცალკე უნდა ამოვიღოთ
          // ქვედა ფუნქცია მაგას აკეთებს
          //productDoc.ref იმისთვის გვჭირდება რო იგივე პროდუქტის price ამოვიღოთ
          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
            };
          });
        });
        setProducts(products);
      });
  }, []);
  console.log(products);
  const loadChekout = async (priceId) => {
    // user.uid რედაქსიდან მოდის ეს,  docRef იქნება იმ იუზერის მონაცემები ვინც დალოგინებულია
    // .collection("checkout_sessions") არის ახალი ბაზა რომელიც შეიქმნება როცა იუზერი subscribe-ს გააკეთებს
    // add({}) ამით გადავცემთ იმ მონაცემებს რაც გვინდა რომ ამ ბაზაში ჩაჯდეს
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        alert(`An error occured: ${error.message}`);
      }
      if (sessionId) {
        // ჩექაუთის ფანჯარაზე გადასვლა გადასვლა
        const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  // const button = () => {
  //   if (subscription.name) {
  //     if (subscription.name === "premium" && product.name === "premium") {
  //       return "asdasd";
  //     }
  //   }
  // };

  return (
    <div>
      {subscription && (
        <p>
          Your subscription expires at:{" "}
          {new Date(
            subscription?.current_period_end * 1000
          ).toLocaleDateString()}
        </p>
      )}
      {/* დეკოსნტრუქცია ახდენს ეს, რაღაც სტრანად მოდის მონაცემები, გასარკვევია ქვედა კოდი ზუსტად როგორ მოქმედებს */}
      {Object.entries(products).map(([productId, productData]) => {
        // ამოწმებს რომელი პაკეტიაქ ნაყიდი და აბრუნებს true-ს შესაბამის სახელზე რო ui გადავაწყოთ
        const product = productData.name?.toLowerCase();
        // ?.toLowerCase()
        // .includes(subscription?.name);
        const isCurrentPackage = productData?.name
          ?.toLowerCase()
          .includes(subscription?.name);

        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && "plansScreen_plan_disabled"
            } plansScreen_plan`}
          >
            <div className="plansScreen_info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button
              onClick={() =>
                !isCurrentPackage && loadChekout(productData?.prices?.priceId)
              }
            >
              {!subscription
                ? "subscribe"
                : product === subscription?.name
                ? "Current Package"
                : subscription?.name === "premium" &&
                  (product === "basic" || "standard")
                ? "You alredy own better package"
                : subscription?.name === "standard" && product === "basic"
                ? "You alredy own better package"
                : "subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
