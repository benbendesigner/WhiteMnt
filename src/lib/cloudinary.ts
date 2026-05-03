export function cloudinaryUrl(
  publicId: string,
  opts: { width?: number; height?: number; crop?: string } = {}
): string {
  const transforms = [
    opts.width ? `w_${opts.width}` : "",
    opts.height ? `h_${opts.height}` : "",
    opts.crop ? `c_${opts.crop}` : "c_fill",
    "f_auto",
    "q_auto",
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
