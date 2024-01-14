export interface VideoInfoData {
  item_list: item[];
}

interface item {
  desc: string;
  video: Video;
  images: Image[];
}

interface Video {
  play_addr: {
    uri
  };
}

interface Image {
  url_list: string[];
}
