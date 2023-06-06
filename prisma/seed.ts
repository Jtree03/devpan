import { PrismaClient } from "@prisma/client";
import urlSlug from "url-slug";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.create({
    data: {
      name: "개발판",
      slug: "main",
    },
  });
  await prisma.techStack.createMany({
    data: [
      {
        name: "JavaScript",
        description: "A high-level, interpreted programming language",
        image: "",
      },
      {
        name: "TypeScript",
        description:
          "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
        image: "",
      },
      {
        name: "React",
        description: "A JavaScript library for building user interfaces",
        image: "",
      },
      {
        name: "Node.js",
        description:
          "A JavaScript runtime built on Chrome's V8 JavaScript engine",
        image: "",
      },
      {
        name: "Prisma",
        description: "Next-generation Node.js and TypeScript ORM for Node.js",
        image: "",
      },
      {
        name: "PostgreSQL",
        description:
          "The World's Most Advanced Open Source Relational Database",
        image: "",
      },
      {
        name: "MongoDB",
        description: "The most popular database for modern apps",
        image: "",
      },
      {
        name: "Redis",
        description:
          "An open source (BSD licensed), in-memory data structure store, used as a database, cache, and message broker.",
        image: "",
      },
      {
        name: "Docker",
        description:
          "Docker is an open platform for developing, shipping, and running applications.",
        image: "",
      },
      {
        name: "Kubernetes",
        description:
          "Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.",
        image: "",
      },
      {
        name: "AWS",
        description: "Amazon Web Services",
        image: "",
      },
      {
        name: "Azure",
        description: "Microsoft Azure",
        image: "",
      },
      {
        name: "Google Cloud",
        description: "Google Cloud Platform",
        image: "",
      },
      {
        name: "Firebase",
        description: "Firebase helps you build and run successful apps",
        image: "",
      },
      {
        name: "Next.js",
        description: "The React Framework for Production",
        image: "",
      },
      {
        name: "Gatsby",
        description: "Gatsby is a React-based open source framework",
        image: "",
      },
      {
        name: "NestJS",
        description:
          "A progressive Node.js framework for building efficient, reliable and scalable server-side applications.",
        image: "",
      },
      {
        name: "Express",
        description:
          "Fast, unopinionated, minimalist web framework for Node.js",
        image: "",
      },
      {
        name: "Fastify",
        description: "Fast and low overhead web framework, for Node.js",
        image: "",
      },
      {
        name: "Socket.io",
        description: "Realtime application framework (Node.JS server)",
        image: "",
      },
      {
        name: "React Native",
        description: "A framework for building native apps with React",
        image: "",
      },
      {
        name: "Dart",
        description:
          "A client-optimized language for fast apps on any platform",
        image: "",
      },
      {
        name: "Flutter",
        description:
          "Flutter is Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
        image: "",
      },
      {
        name: "Ionic",
        description: "Ionic Framework is a powerful UI toolkit",
        image: "",
      },
      {
        name: "Electron",
        description: "Build cross-platform desktop apps with JavaScript",
        image: "",
      },
      {
        name: "Tailwind CSS",
        description: "A utility-first CSS framework for rapid UI development",
        image: "",
      },
      {
        name: "Bootstrap",
        description:
          "The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web.",
        image: "",
      },
      {
        name: "Material UI",
        description: "React components for faster and easier web development.",
        image: "",
      },
      {
        name: "Chakra UI",
        description: "Simple, Modular & Accessible UI Components for React",
        image: "",
      },
      {
        name: "Ant Design",
        description: "A design system for enterprise-level products.",
        image: "",
      },
      {
        name: "Jest",
        description:
          "Delightful JavaScript Testing Framework with a focus on simplicity",
        image: "",
      },
      {
        name: "Cypress",
        description:
          "Fast, easy and reliable testing for anything that runs in a browser.",
        image: "",
      },
      {
        name: "Mocha",
        description:
          "Simple, flexible, fun JavaScript test framework for Node.js & The Browser",
        image: "",
      },
      {
        name: "Jasmine",
        description: "DOM-less simple JavaScript testing framework",
        image: "",
      },
      {
        name: "Enzyme",
        description:
          "Enzyme is a JavaScript Testing utility for React that makes it easier to test your React Components' output.",
        image: "",
      },
      {
        name: "Rust",
        description: "A language empowering everyone to build reliable",
        image: "",
      },
      {
        name: "Kotlin",
        description:
          "Statically typed programming language for modern multiplatform applications",
        image: "",
      },
      {
        name: "Java",
        description:
          "A concurrent, class-based, object-oriented, language specifically designed to have as few implementation dependencies as possible",
        image: "",
      },
      {
        name: "Python",
        description:
          "Python is a programming language that lets you work quickly and integrate systems more effectively.",
        image: "",
      },
      {
        name: "C#",
        description: "A general-purpose, multi-paradigm programming language",
        image: "",
      },
      {
        name: "C++",
        description:
          "A powerful general-purpose programming language. It can be used to develop operating systems, browsers, games, and so on.",
        image: "",
      },
      {
        name: "C",
        description:
          "A general-purpose, procedural computer programming language",
        image: "",
      },
      {
        name: "Go",
        description: "An open source programming language that makes it easy",
        image: "",
      },
      {
        name: "Ruby",
        description: "A dynamic, open source programming language",
        image: "",
      },
      {
        name: "PHP",
        description: "A popular general-purpose scripting language",
        image: "",
      },
      {
        name: "Swift",
        description:
          "A general-purpose, multi-paradigm, compiled programming language",
        image: "",
      },
      {
        name: "R",
        description: "A language and environment for statistical computing",
        image: "",
      },
      {
        name: "GraphQL",
        description: "A query language for your API",
        image: "",
      },
      {
        name: "Apollo",
        description: "A single versatile GraphQL data graph layer",
        image: "",
      },
    ],
  });

  const techStacks = await prisma.techStack.findMany();
  const data = techStacks.map((techStack) => {
    return {
      name: techStack.name,
      slug: urlSlug(techStack.name),
    };
  });
  await prisma.category.createMany({
    data,
  });
  const categories = await prisma.category.findMany();
  const promiseCategories = categories.map(async (category) => {
    if (category.name === "개발판") return;
    const techStack = await prisma.techStack.findFirstOrThrow({
      where: { name: category.name },
    });
    await prisma.techStack.update({
      where: { id: techStack.id },
      data: { categoryID: category.id },
    });
  });
  await Promise.all(promiseCategories);
  const subjectData = categories.flatMap((category) => {
    const data = [
      {
        name: "공지",
        slug: "notice",
        categoryID: category.id,
      },
      {
        name: "정보",
        slug: "info",
        categoryID: category.id,
      },
      {
        name: "자유",
        slug: "free",
        categoryID: category.id,
      },
      {
        name: "질문",
        slug: "question",
        categoryID: category.id,
      },
    ];
    return data;
  });
  await prisma.subject.createMany({
    data: subjectData,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
