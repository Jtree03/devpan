import Image from "next/image";

import LoadingImage from "@/asset/loading.png";

import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loading}>
      <Image src={LoadingImage} alt="loading" width={40} height={40} />
    </div>
  );
}
