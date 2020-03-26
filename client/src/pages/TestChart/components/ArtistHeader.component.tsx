import "./ArtistHeader.style.scss";
import React, { useEffect, useState } from "react";
import { IArtist } from "../../../contexts/ArtistContext";
import { Palette } from "node-vibrant/lib/color";
import Vibrant from "node-vibrant";

export const ArtistHeaderComponent = ({
  artist,
}: {
  artist: IArtist;
}): JSX.Element => {
  const [palette, setPalette] = useState<Palette>();

  useEffect(() => {
    const getPalette = async (): Promise<void> => {
      const vibrant = new Vibrant(artist.image, { colorCount: 256 });
      const vibrantPalette = await vibrant.getPalette();

      setPalette(vibrantPalette);
    };

    getPalette();
  }, [artist.image]);

  return (
    <header>
      <div
        className="header"
        style={{
          background: palette?.DarkMuted?.getHex(),
          color: palette?.DarkMuted?.getTitleTextColor(),
        }}
      >
        <div className="header__background">
          <div
            className="header__background__image"
            style={{ backgroundImage: `url(${artist.image})` }}
          />
          <div
            className="header__background__overlay"
            style={{
              background: `linear-gradient(0.25turn, rgba(${palette?.DarkMuted?.getRgb().join(
                ", ",
              )}, 1), rgba(${palette?.DarkMuted?.getRgb().join(", ")}, 0))`,
            }}
          />
        </div>
        <div className="header__content">
          <h2 className="header__content__description">Most listened artist</h2>
          <h1 className="header__content__title">{artist.name}</h1>
          <h2 className="header__content__description">
            {artist.playcount} scrobbles
          </h2>
        </div>
      </div>
    </header>
  );
};
