/**
 * PageTransition — CSS-only page entrance animation wrapper
 * Re-triggers on route changes via key prop.
 */
import { useEffect, useState, type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  routeKey: string;
}

export function PageTransition({ children, routeKey }: PageTransitionProps) {
  const [animKey, setAnimKey] = useState(routeKey);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (routeKey !== animKey) {
      setVisible(false);
      const timer = setTimeout(() => {
        setAnimKey(routeKey);
        setVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [routeKey, animKey]);

  return (
    <div
      key={animKey}
      className={visible ? "tutor-page-enter" : ""}
      style={{
        opacity: visible ? undefined : 0,
        transition: "opacity 0.15s ease-out",
      }}
    >
      {children}
    </div>
  );
}

export default PageTransition;
