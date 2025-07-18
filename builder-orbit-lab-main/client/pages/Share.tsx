import Layout from "../components/Layout";
import React from "react";

export default function Share() {
  return (
    <Layout showSearch={false}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Share</h1>
        <p className="text-lg text-gray-600 mb-6">Tính năng này sẽ sớm ra mắt! (Coming soon...)</p>
        <span className="text-5xl animate-bounce">🚧</span>
      </div>
    </Layout>
  );
} 