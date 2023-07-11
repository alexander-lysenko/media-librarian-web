import { DataColumnPropsByType } from "../types";

export const dataColumnPropsByType: DataColumnPropsByType = {
  line: {
    contentCellStyle: { maxWidth: 250 },
  },
  text: {
    contentCellStyle: { maxWidth: 350 },
  },
  url: {
    contentCellStyle: { maxWidth: 150 },
  },
  date: {
    headerCellStyle: { textAlign: "right", maxWidth: 150 },
    contentCellStyle: { textAlign: "right", maxWidth: 150 },
  },
  datetime: {
    headerCellStyle: { textAlign: "right", maxWidth: 200 },
    contentCellStyle: { textAlign: "right", maxWidth: 200 },
  },
  rating5: {
    contentCellStyle: { maxWidth: 150 },
  },
  rating5precision: {
    contentCellStyle: { maxWidth: 150 },
  },
  rating10: {
    contentCellStyle: { maxWidth: 250 },
  },
  rating10precision: {
    contentCellStyle: { maxWidth: 250 },
  },
  switch: {
    contentCellStyle: { maxWidth: 100 },
  },
  priority: {
    contentCellStyle: { maxWidth: 150 },
  },
};
