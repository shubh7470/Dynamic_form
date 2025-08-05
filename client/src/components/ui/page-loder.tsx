import styled from "styled-components";

const PageLoder = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-black/[0.4]">
      <StyledWrapper>
        <div className="loaderRectangle">
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  .loaderRectangle {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0 3px;
  }

  .loaderRectangle div {
    width: 10px;
    height: 16px;
    animation: 0.9s ease-in-out infinite;
    background: #f3f4f6; /* white color */
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); /* white glow effect */
  }

  .loaderRectangle div:nth-child(1) {
    animation-name: rectangleOneAnim;
    animation-delay: 1s;
  }

  @keyframes rectangleOneAnim {
    0% {
      height: 15px;
    }

    40% {
      height: 30px;
    }

    100% {
      height: 15px;
    }
  }

  .loaderRectangle div:nth-child(2) {
    animation-name: rectangleTwoAnim;
    animation-delay: 1.1s;
  }

  @keyframes rectangleTwoAnim {
    0% {
      height: 15px;
    }

    40% {
      height: 40px;
    }

    100% {
      height: 15px;
    }
  }

  .loaderRectangle div:nth-child(3) {
    animation-name: rectangleThreeAnim;
    animation-delay: 1.2s;
  }

  @keyframes rectangleThreeAnim {
    0% {
      height: 15px;
    }

    40% {
      height: 50px;
    }

    100% {
      height: 15px;
    }
  }

  .loaderRectangle div:nth-child(4) {
    animation-name: rectangleFourAnim;
    animation-delay: 1.3s;
  }

  @keyframes rectangleFourAnim {
    0% {
      height: 15px;
    }

    40% {
      height: 40px;
    }

    100% {
      height: 15px;
    }
  }

  .loaderRectangle div:nth-child(5) {
    animation-name: rectangleFiveAnim;
    animation-delay: 1.4s;
  }

  @keyframes rectangleFiveAnim {
    0% {
      height: 15px;
    }

    40% {
      height: 30px;
    }

    100% {
      height: 15px;
    }
  }
`;

export default PageLoder;
