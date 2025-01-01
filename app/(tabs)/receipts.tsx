import { useCallback, useEffect, useState } from "react";
import { Surface } from "react-native-paper";
import receiptsService from "@/services/receipts";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { sortingList, filterList } from "@/constants/ReceiptsOptions";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export default function Employees() {
  const [receipts, setReceipts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<{
    key: string | null;
    label: string | null;
  }>(sortingList[0]);
  const [filters, setFilters] = useState<any[]>(filterList);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    numPages: 0,
    perPage: 10,
    next: null,
    previous: null,
    count: 0,
    totalCount: 0,
  });

  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const fetchEmployees = useCallback(() => {
    const params: Record<string, string> = {};

    if (searchQuery) {
      params.search = searchQuery;
    }

    if (sort?.key) {
      params.sort = sort.key;
    }

    filters.forEach((filter) => {
      const selected = filter.values.find((v) => v.isSelected);
      if (selected) {
        params[filter.key] = selected.key;
      }
    });

    params.page = String(pagination.next || 1);
    params.perPage = String(pagination.perPage);

    receiptsService.getReceipts(params).then((response) => {
      setReceipts(response.results);
      setPagination({
        numPages: response.numPages,
        perPage: response.perPage,
        next: response.next,
        previous: response.previous,
        count: response.count,
        totalCount: response.totalCount,
      });
    });
  }, [searchQuery, sort, filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDownloadPDF = (id: string) => {
    receiptsService.getReceiptPDF(id).then(async (response) => {
      const pdfUrl = response.file;

      const fileUri = FileSystem.documentDirectory + "recibo.pdf";

      try {
        const downloadRes = await FileSystem.downloadAsync(pdfUrl, fileUri);

        await Sharing.shareAsync(downloadRes.uri);
      } catch (error) {
        Alert.alert("Error al descargar el recibo");
      }
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Surface style={styles.surfaceCointainer} elevation={2}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            Lista de Recibos
          </Text>
          <View
            style={{
              backgroundColor: "#2563EB",
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 9999,
              marginLeft: 8,
            }}
          >
            <Text
              style={{
                color: "#fff",
                display: "flex",
                fontSize: 16,
              }}
            >
              {pagination.totalCount}
            </Text>
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#3b82f6",
              padding: 12,
              borderRadius: 8,
              marginRight: 16,
              marginBottom: 16,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="refresh" size={20} color="white" />
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              REFRESCAR LISTA DE RECIBOS
            </Text>
          </TouchableOpacity>
        </View>
      </Surface>

      <View style={{ flex: 1, backgroundColor: "#f3f4f6", padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => setShowSortOptions(!showSortOptions)}
          >
            <Text style={{ color: "black" }}>{sort.label}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Text style={{ color: "#3b82f6" }}>Agregar filtro +</Text>
          </TouchableOpacity>
        </View>

        {showSortOptions && (
          <View
            style={{
              position: "absolute",
              top: 50,
              left: 16,
              right: 16,
              backgroundColor: "white",
              elevation: 4,
              borderRadius: 8,
              zIndex: 10,
            }}
          >
            {sortingList.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#e5e7eb",
                }}
                onPress={() => {
                  setSort(option);
                  setShowSortOptions(false);
                }}
              >
                <Text style={{ color: "black" }}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TextInput
          placeholder="Buscar recibo"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />

        <Modal
          visible={showFilterPanel}
          transparent={true}
          animationType="slide"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 24,
                borderRadius: 8,
                width: 320,
                height: 400,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}
              >
                Filtrar recibos
              </Text>

              <ScrollView style={{ padding: 24 }}>
                {filters.map((filter) => (
                  <View key={filter.key}>
                    <Text style={{ marginBottom: 8 }}>{filter.label}</Text>
                    <Picker
                      selectedValue={
                        filter.values.find((v) => v.isSelected)?.label ?? ""
                      }
                      onValueChange={(selectedKey) => {
                        const newFilters = filters.map((f) => {
                          if (f.key === filter.key) {
                            return {
                              ...f,
                              values: f.values.map((val) => {
                                if (val.key === selectedKey) {
                                  return { ...val, isSelected: true };
                                }
                                // Or, if you only allow one selected value:
                                return { ...val, isSelected: false };
                              }),
                            };
                          }
                          return f;
                        });
                        setFilters(newFilters);
                      }}
                      style={{ marginBottom: 12, backgroundColor: "gray-200" }}
                    >
                      {filter.values.map((value) => (
                        <Picker.Item
                          key={value.key}
                          label={value.label}
                          value={value.key}
                        />
                      ))}
                    </Picker>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={() => setShowFilterPanel(false)}
                style={{
                  backgroundColor: "#3b82f6",
                  padding: 8,
                  borderRadius: 8,
                  marginTop: 16,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Aplicar filtros
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#ef4444",
                  padding: 8,
                  borderRadius: 8,
                  marginTop: 8,
                }}
                onPress={() => {
                  setFilters(filterList);
                  setShowFilterPanel(false);
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Borrar filtros
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {receipts.length > 0 ? (
          <ScrollView
            horizontal
            contentContainerStyle={{ flexDirection: "column" }}
          >
            <View
              style={{
                backgroundColor: "#3b82f6",
                padding: 12,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                flexDirection: "row",
                height: 50,
                maxHeight: 50,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "left",
                  minWidth: 100,
                  flex: 1,
                }}
              >
                Tipo
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  minWidth: 100,
                  flex: 1,
                }}
              >
                Empleado
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  minWidth: 100,
                  flex: 1,
                }}
              >
                Fecha
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  minWidth: 100,
                  flex: 1,
                }}
              >
                Enviado
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  minWidth: 100,
                  flex: 1,
                }}
              >
                Leido
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  minWidth: 100,
                  flex: 1,
                }}
              >
                Firmado
              </Text>
            </View>
            {receipts.map((row: any) => (
              <RenderRow key={row.id} row={row} onPress={handleDownloadPDF} />
            ))}
          </ScrollView>
        ) : (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>
              No hay resultados
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const RenderRow = ({
  row,
  onPress,
}: {
  row: any;
  onPress: (id: string) => void;
}) => (
  <TouchableOpacity
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      padding: 12,
    }}
    onPress={() => onPress(row.id)}
  >
    <Text style={{ padding: 4, minWidth: 100, flex: 1, textAlign: "center" }}>
      {row.type}
    </Text>
    <Text style={{ padding: 4, minWidth: 100, flex: 1, textAlign: "center" }}>
      {row.employee}
    </Text>
    <Text style={{ padding: 4, minWidth: 100, flex: 1, textAlign: "center" }}>
      {row.fullDate}
    </Text>
    <View
      style={{
        minWidth: 100,
        flex: 1,
        alignItems: "center",
      }}
    >
      {row?.isSended ? (
        <MaterialIcons name="done" size={20} color="green" />
      ) : (
        <MaterialIcons name="close" size={20} color="red" />
      )}
    </View>
    <View
      style={{
        minWidth: 100,
        flex: 1,
        alignItems: "center",
      }}
    >
      {row?.isReaded ? (
        <MaterialIcons name="done" size={20} color="green" />
      ) : (
        <MaterialIcons name="close" size={20} color="red" />
      )}
    </View>
    <View
      style={{
        minWidth: 100,
        flex: 1,
        alignItems: "center",
      }}
    >
      {row?.isSigned ? (
        <MaterialIcons name="done" size={20} color="green" />
      ) : (
        <MaterialIcons name="close" size={20} color="red" />
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  surfaceCointainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
  },
});
