/** @type {import('next').NextConfig} */
const nextConfig = {
  // 패키지가 TS 소스를 그대로 export 하므로 Next 가 트랜스파일하도록 지정
  transpilePackages: [
    "@skyface/ui",
    "@skyface/hooks",
    "@skyface/utils",
    "@skyface/api",
    "@skyface/theme",
  ],
};

export default nextConfig;
