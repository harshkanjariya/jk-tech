import { EditorOptions } from 'tinymce';

export const TINYMCE_CONFIG: Partial<EditorOptions> = {
  suffix: '.min',
  menubar: true,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
    'codesample', 'toc', 'hr'
  ],
  toolbar: `undo redo | blocks | bold italic underline strikethrough |
          alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |
          table link image media codesample | emoticons charmap | hr toc preview fullscreen`,

  image_advtab: true,
  media_live_embeds: true,

  content_style: `
  body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; }
  blockquote { font-style: italic; border-left: 4px solid #ccc; padding-left: 10px; margin-left: 10px; }
  pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
  h1, h2, h3, h4 { font-weight: bold; }
  `,

  images_upload_url: 'http://localhost:3000/upload',
  automatic_uploads: true,

  table_advtab: true,
  table_default_styles: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  wordcount_countregex: /[\w]+/g,
  branding: false,
};
