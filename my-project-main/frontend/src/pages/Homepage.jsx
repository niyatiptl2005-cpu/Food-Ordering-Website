import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";


function Homepage() {
  const items = [
    {
      id: 1,
      title: "Crispy loadded Fries",
      img: "../src/assets/french-fries.png",
      desc: "Potatoes are sliced, soaked, and double-fried for that perfect crisp. Seasoning ranges from simple salt to garlic, paprika, or cheese.",
    },
    {
      id: 2,
      title: "Spicy Max Burgur",
      img: "../src/assets/burgur1.png",
      desc: "A classic burger includes a beef patty, onion,tometo , garlic, cheese, and condiments like ketchup or mayo, all nestled in a soft bun.",
    },
    {
      id: 3,
      title: "Classic Sandwich",
      img: "../src/assets/sandwich.png",
      desc: " layered with roasted vegetables, pesto, and artisanal meats, sandwiches adapt to every culture, taste, and occasion.layered specility",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="homepage">
        <div className="overlay">
          <div className="home-text">
            <h2>CampusBite</h2>
            <p>Fast, Fresh, Frictionless...</p>
            
          </div>
        </div>
      </div>

      {/* Our Speciality Section */}
      <section className="speciality">
        <h2>
          Our <span>Special</span> Food
        </h2>
        <div className="speciality-container">
          {items.map((item) => (
            <div className="card" key={item.id}>
              <div className="img-box">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

 {/* Our Services Section */}
<section className="services">
  <h1 className="services-subtitle">Our Services</h1>
  <h3 className="services-title">
    We Dish Out Satisfaction <br /> Through Our Services
  </h3>

  <div className="services-container">
    <div className="service-card">
      <img src="../src/assets/ing.png" alt="Fresh Ingredients" />
      <h3>Fresh Ingredients</h3>
      <p>
        We use the best, fresh & local ingredients in our baked cakes, bread &
        cooked food.
      </p>
    </div>

    <div className="service-card">
      <img src="../src/assets/upt.png" alt="Regular Updates" />
      <h3>Regular Upadates</h3>
      <p>
         We regularly update our platform to improve performance, add new features,
    enhance user experience. 
      </p>
    </div>

    <div className="service-card">
      <img src="../src/assets/Qut.png" alt="Quality Check" />
      <h3>Quality Check</h3>
      <p>
        Everything is best quelity— from coffee to burgers, and drinks to
        meals.
      </p>
    </div>
  </div>
</section>

{/* Testimonials Section */}
<section className="testimonials">
  <h2 className="testimonials-title">Our Customers Review</h2>
  <p className="testimonials-subtitle">
    See What Customers Says About Us 
  </p>

  <div className="testimonial-container">
    <div className="testimonial-card">
      <div className="testimonial-img">
        <img src="../src/assets/p(1).png" alt="Avinash Kr" />
      </div>
      <p className="testimonial-text">
       “CampusBite makes ordering food between classes so easy! The delivery is always quick and the food is fresh. I love their crispy fries and sandwiches!”
      </p>
      <h4 className="testimonial-name">Avinash Kr</h4>
      
    </div>

    <div className="testimonial-card">
      <div className="testimonial-img">
        <img src="../src/assets/p(2).png" alt="Bharat Kunal" />
      </div>
      <p className="testimonial-text">
         “The best part about CampusBite is their regular updates and amazing offers. I always get notified about new dishes and discounts — perfect for students!”
      </p>
      <h4 className="testimonial-name">Bharat Kunal</h4>
      
    </div>

    <div className="testimonial-card">
      <div className="testimonial-img">
        <img src="../src/assets/p(3).png" alt="Prabhakar D" />
      </div>
      <p className="testimonial-text">
       “Affordable, tasty, and fast. CampusBite is literally my go-to app during lunch breaks. Highly recommend it to every college student ! perfect for students!”
      </p>
      <h4 className="testimonial-name">Prabhakar D</h4>
   
    </div>
  </div>
</section>



    </>
  );
}

export default Homepage;
