import "./resizable.css";
import { Fragment, useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(maxWidth());
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  function maxWidth() {
    return window.innerWidth * 0.75;
  }

  useEffect(() => {
    let timer: any;

    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);
        if (maxWidth() < width) {
          setWidth(maxWidth());
        }
      }, 100);
    };
    window.addEventListener("resize", listener);

    return () => window.removeEventListener("resize", listener);
  }, [width]);

  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [maxWidth(), Infinity],
      height: Infinity,
      width,
      resizeHandles: ["e"],
      onResizeStop: (event, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      minConstraints: [Infinity, 24],
      maxConstraints: [Infinity, innerHeight * 0.9],
      height: 300,
      width: Infinity,
      resizeHandles: ["s"],
    };
  }
  return (
    <ResizableBox {...resizableProps}>
      <Fragment>{children}</Fragment>
    </ResizableBox>
  );
  // );
};

export default Resizable;
