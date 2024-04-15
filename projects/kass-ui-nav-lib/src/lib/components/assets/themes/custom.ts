export const customTheme = `
.custom{

    &.links {
      color: color_font;

      .label-area {
        .icon {
          background: color_base_link_icon !important;
        }
      }

      .btn-expand {
        color: color_font !important;
        background-color: color_base_link !important;

        &.active,
        &:hover {
          background-color: color_back_link !important;
        }
      }

      .btn-link {
        background-color: color_base_link !important;
        color: color_font !important;

        &.active,
        &:hover {
          background-color: color_back_link !important;
        }
      }

      .links-sub {
        .links {
          .btn-link {
            background: color_base_link !important;
            color: color_font !important;

            &:hover {
              background-color: color_back_link !important;
            }
          }
        }
      }

      .divider {
        border-image-source: color_border !important;
      }
    }

  }
`;
