import {
  resolveWebLink,
} from "./src/services/link/link.service.js";


const test = async () => {

  try {

    const url =
      process.argv[2];


    if (!url) {
      console.log(
        "Please provide a URL"
      );

      process.exit(1);
    }


    console.log(
      "\nTesting Recall Link Resolver...\n"
    );


    const result =
      await resolveWebLink(url);


    console.log({
      originalUrl:
        result.originalUrl,

      domain:
        result.domain,

      pageTitle:
        result.pageTitle,

      description:
        result.description,

      author:
        result.author,

      previewImage:
        result.previewImage,

      contentLength:
        result.content.length,

      contentPreview:
        result.content.slice(
          0,
          1000
        ),
    });


  } catch (error) {

    console.error(
      "\nLink extraction failed:"
    );

    console.error(
      error.message
    );

  }
};


test();