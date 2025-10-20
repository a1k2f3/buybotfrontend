import React from "react"
interface LogoProps {
  title: string;
}
const Logo: React.FC<LogoProps> = ({title}) => {
  return (
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-blue-600">LOGO</h1>
      <p className="text-gray-500 mt-2">{title}.</p>
    </div>
  );
};

export default Logo;
