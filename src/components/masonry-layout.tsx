import React, { useRef, useEffect, ReactNode, Children } from "react";
import Bricks from "bricks.js";

interface Size {
  columns: number;
  gutter: number;
  imageWidth: number;
}

interface MasonryLayoutProps {
  children: ReactNode;
  sizes: Size[];
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ children, sizes }) => {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return;
    const bricks = Bricks({
      container: container.current,
      packed: "data-packed",
      sizes,
      position: true,
    });

    bricks.resize(true);

    if (Children.count(children) > 0) {
      bricks.pack();
    }
  }, [children, sizes]);

  return (
    <div ref={container} data-testid="MasonryLayoutContainer">
      {children}
    </div>
  );
};

export default MasonryLayout;
