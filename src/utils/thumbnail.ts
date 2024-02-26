import { UserDTO } from "../api/models/user.model";

function userIconOrGenerated(user: UserDTO) {
  if (user.imgUrl?.length > 0) return user.imgUrl;

  const userInitials = `${user.firstName.charAt(0).toUpperCase()}${user.lastName
    .charAt(0)
    .toUpperCase()}`;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return "";

  canvas.width = 200;
  canvas.height = 200;

  // Draw background
  context.fillStyle = generateBackgroundColor(`${user.firstName}${user.lastName}`);
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  context.font = "bold 100px Assistant";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(userInitials, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL("image/png");
}

function generateBackgroundColor(str: string) {
  // Convert the input string to a numeric value
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + (hash << 5) - hash;
  }

  // Calculate RGB values based on the hash
  const r = ((hash & 0xff) % 150) + 50; // Adjust the range and offset for desired darkness
  const g = (((hash >> 8) & 0xff) % 150) + 50;
  const b = (((hash >> 16) & 0xff) % 150) + 50;

  // Convert RGB to hexadecimal color representation
  const colorHex = `#${((r << 16) | (g << 8) | b)
    .toString(16)
    .padStart(6, "0")}`;

  return colorHex;
}

export { userIconOrGenerated };
