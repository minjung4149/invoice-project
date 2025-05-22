"use client";
import {useEffect} from "react";

type PrintDirectionType = "landscape" | "portrait";

interface Props {
  type?: PrintDirectionType; // 기본값은 portrait
}

const PrintDirection = ({type = "portrait"}: Props) => {
  useEffect(() => {
    const id = `print-css-${type}`;
    const href = `/styles/${type}-print.css`;

    // 이미 삽입된 경우 중복 삽입 방지
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    link.media = "print";
    document.head.appendChild(link);

    return () => {
      const el = document.getElementById(id);
      if (el) {
        document.head.removeChild(el);
      }
    };
  }, [type]);

  return null;
};

export default PrintDirection;
