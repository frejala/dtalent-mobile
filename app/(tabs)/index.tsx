import { useCallback, useEffect, useState } from "react";
import { Surface } from "react-native-paper";
import employeesService from "@/services/employees";
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
import { sortingList, filterList } from "@/constants/EmployeesOptions";
import { Picker } from "@react-native-picker/picker";
import React from "react";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
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

    employeesService.getEmployees(params).then((response) => {
      setEmployees(response.results);
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 0,
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
            Lista de Empleados
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
              borderWidth: 1,
              padding: 12,
              borderRadius: 8,
              marginRight: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "black",
                fontWeight: "600",
              }}
            >
              IMPORTAR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#3b82f6",
              padding: 12,
              borderRadius: 8,
              marginRight: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "600",
              }}
            >
              + NUEVO EMPLEADO
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
          placeholder="Buscar empleado"
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
                Filtrar empleados
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

        {employees.length > 0 ? (
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
                  minWidth: 80,
                  flex: 1,
                }}
              >
                Número
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "left",
                  minWidth: 160,
                  flex: 1,
                }}
              >
                Nombre
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "left",
                  minWidth: 150,
                  flex: 1,
                }}
              >
                Correo Electrónico
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "left",
                  minWidth: 80,
                  flex: 1,
                }}
              >
                Teléfono
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "left",
                  minWidth: 80,
                  flex: 1,
                }}
              >
                Estado
              </Text>
            </View>
            {employees.map((row) => renderRow(row))}
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

const renderRow = (row: any) => (
  <View
    key={row.id}
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      padding: 12,
    }}
  >
    <Text style={{ padding: 4, minWidth: 80, flex: 1 }}>
      {row.employeeNumber}
    </Text>
    <Text style={{ padding: 4, minWidth: 160, flex: 1 }}>{row.fullName}</Text>
    <Text style={{ padding: 4, minWidth: 150, flex: 1 }}>{row.email}</Text>
    <Text style={{ padding: 4, minWidth: 80, flex: 1 }}>{row.phoneNumber}</Text>
    <View
      style={{
        minWidth: 80,
        flex: 1,
        alignItems: "center",
      }}
    >
      {row?.isActive ? (
        <MaterialIcons name="done" size={20} color="green" />
      ) : (
        <MaterialIcons name="close" size={20} color="red" />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  surfaceCointainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: -30,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
  },
});
