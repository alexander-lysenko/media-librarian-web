type RowsPerPageOptions = Array<number | { label: string; value: number }> | [];

export const detectRowsPerPageOptions = (len: number, labelForAll?: string): RowsPerPageOptions => {
  const rPpOpts: RowsPerPageOptions = [];
  len > 10 && rPpOpts.push({ label: "10", value: 10 } as never);
  len > 25 && rPpOpts.push({ label: "25", value: 25 } as never);
  len > 50 && rPpOpts.push({ label: "50", value: 50 } as never);
  len > 100 && rPpOpts.push({ label: "100", value: 100 } as never);
  labelForAll && rPpOpts.push({ label: labelForAll, value: -1 } as never);

  return rPpOpts;
};
