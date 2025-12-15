import styles from "./TableWrapper.module.css";

interface TableWrapperProps {
  children: React.ReactNode;
}

/**
 * 通用表格包装组件
 * 默认行为：第一列和最后一列不换行，适用于大多数表格场景
 */
const TableWrapper = ({ children }: TableWrapperProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className={styles.table}>{children}</table>
    </div>
  );
};

export default TableWrapper;
