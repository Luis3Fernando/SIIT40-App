module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@screens": "./src/app/screens",
            "@components": "./src/app/components",
            "@navigation": "./src/app/navigation",
            "@theme": "./src/app/theme",
            "@models": "./src/domain/models",
            "@usecases": "./src/domain/usecases",
            "@services": "./src/data/services",
            "@adapters": "./src/data/adapters",
            "@storage": "./src/data/storage",
            "@config": "./src/core/config",
            "@utils": "./src/core/utils",
            "@constants": "./src/core/constants",
            "@types": "./src/core/types",
            "@custom-hooks/*": "./src/hooks",
            "@redux/*": "./src/redux",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      ],
    ],
  };
};
