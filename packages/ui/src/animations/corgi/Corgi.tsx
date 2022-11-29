import "./corgi.css";
export const Corgi = () => (
  <div className="mb-10">
    <div className="container">
      <div className="corgi h-20">
        <div className="head">
          <div className="ear ear--r"></div>
          <div className="ear ear--l"></div>
          <div className="eye eye--left"></div>
          <div className="eye eye--right"></div>
          <div className="face">
            <div className="face__white">
              <div className="face__orange face__orange--l"></div>
              <div className="face__orange face__orange--r"></div>
            </div>
          </div>
          <div className="face__curve"></div>
          <div className="mouth">
            <div className="nose"></div>
            <div className="mouth__left">
              <div className="mouth__left--round"></div>
              <div className="mouth__left--sharp"></div>
            </div>
            <div className="lowerjaw">
              <div className="lips"></div>
              <div className="tongue test"></div>
            </div>
            <div className="snout"></div>
          </div>
        </div>
        <div className="neck__back"></div>
        <div className="neck__front"></div>
        <div className="body">
          <div className="body__chest"></div>
        </div>
        <div className="foot foot__left foot__front foot__1"></div>
        <div className="foot foot__right foot__front foot__2"></div>
        <div className="foot foot__left foot__back foot__3"></div>
        <div className="foot foot__right foot__back foot__4"></div>
        <div className="tail test"></div>
      </div>
    </div>
  </div>
);
