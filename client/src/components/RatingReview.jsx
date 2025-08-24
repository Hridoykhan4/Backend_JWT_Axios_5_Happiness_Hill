import { Star } from "lucide-react";

const RatingReview = ({ rating, setRating }) => {
  return (
    <div className="flex justify-center items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          className={` text-xl font-semibold ${
            rating >= star ? "bg-yellow-600" : "bg-gray-600"
          }`}
        >
          <Star></Star>
        </span>
      ))}
    </div>
  );
};

export default RatingReview;
